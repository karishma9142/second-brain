interface buttonProps {
    varient : "primary" | "secondary",
    size : "sm" | "md" | "lg" ,
    text : String ,
    startIcon? : any, //optionl
    endIcon? : any , // optional
    onclick : () => void
}

const varientStyle = {
    "primary" : "bg-pu600 text-white",
    "secondary" : "bg-pu400 text-pu600"
}

const defaultStyle = "rounded-md p-4";

const sizeStyle = {
    "sm" : "p-2" ,
    "md" : "p-4" ,
    "lg" : "p-6"
}
export const Button =(prpos : buttonProps) => {
    return <button className={ `${defaultStyle} ${sizeStyle[prpos.size]} ${varientStyle[prpos.varient]}`}>{prpos.text}</button>
}   