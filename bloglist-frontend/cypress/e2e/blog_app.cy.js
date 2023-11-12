describe('Blog app', () => {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user1 = {
      name: 'Sampino Laviola',
      username: 'sampino',
      password: 'test'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user1)
    const user2 = {
      name: 'Mike Maignan',
      username: 'eagle',
      password: 'ciao'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user2)

    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
  })

  describe('Login', function () {
    Cypress.Commands.add('login', ({ username, password }) => {
      cy.request('post', `${Cypress.env('BACKEND')}/login`, {
        username, password
      }).then(({ body }) => {
        localStorage.setItem('loggedUser', JSON.stringify(body))
        cy.visit('')
      })
    })

    it('succeeds with correct credentials', function () {
      cy.login({ username: 'sampino', password: 'test' })
      cy.contains('Sampino Laviola logged in')
      cy.contains('Create blog')
    })

    describe('when logged in', function () {
      beforeEach(function () {
        cy.login({ username: 'sampino', password: 'test' })
      })

      it('a blog can be created', function () {
        cy.get('#create-toggle').click()
        cy.get('#title').type('The imperial Roman')
        cy.get('#author').type('Dante Alga')
        cy.get('#url').type('www.itdoesnotexist.com')
        cy.get('#create').click()
        cy.contains('The imperial Roman')
      })

      Cypress.Commands.add('createBlog', ({ title, author, url, upvotes }) => {
        cy.request({
          url: `${Cypress.env('BACKEND')}/blogs`,
          method: 'POST',
          body: { title, author, url, upvotes },
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedUser')).token}`
          }
        })
        cy.visit('')
      })

      describe('when a note exists', function () {
        beforeEach(function () {
          cy.createBlog({ title: 'Mountain Bike', author: 'Marci Del Monte', url: 'www.bikemike.com', upvotes: 31 })
          cy.createBlog({ title: 'Spider Woman', author: 'Ruy Gullit', url: 'www.spiderwoman.com', upvotes: 22 })
          cy.createBlog({ title: 'Mappi Lappo', author: 'Lapo Eldog', url: 'www.mappilappo.com', upvotes: 56 })
        })

        it('it can be possibile to like the blog', function () {
          cy.contains('Show details').click()
          cy.get('#like-btn').eq(0).click()
          cy.get('.upvotes').eq(0).contains('57')
        })

        it('it can be possibile to see button delete only by creator and deleting it as well', function () {
          cy.contains('Delete blog')
          cy.get('#delete-btn').click()
          cy.get('html').should('not.contain', 'Mappi Lappo').and('contain', 'Blog deleted')
        })

        it('blogs are ordered by upvotes', function () {
          cy.get('.blog').eq(0).contains('Mappi Lappo')
          cy.get('.blog').eq(1).contains('Mountain Bike')
          cy.get('.blog').eq(2).contains('Spider Woman')
        })

      })

    })

  })

  it('fails with wrong credentials', function () {
    cy.get('#username').type('malè')
    cy.get('#password').type('ounas')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'wrong username or password')
  })


})
