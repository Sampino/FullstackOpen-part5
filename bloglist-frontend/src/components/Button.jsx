
const Button = ({ id, type, label, handler, style, className }) => {
  return (
    <button id={id} style={style} className={className} type={type} onClick={handler}>{label}</button>
  )
}

export default Button