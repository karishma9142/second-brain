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
    "secondary" : "bg-pu300 text-pu600"
}

const defaultStyle = "rounded-md p-2";

const sizeStyle = {
    "sm" : "px-2 py-1 text-sm" ,
    "md" : "pl-4 pr-6 py-2 text-sm" ,
    "lg" : "px-6 py-3 text-sm"
}
export const Button =(prpos : buttonProps) => {
    return <button className={ `${defaultStyle} ${sizeStyle[prpos.size]} ${varientStyle[prpos.varient]}`}>
        <div className="flex gap-1.5 items-center">{prpos.startIcon} {prpos.text} {prpos.endIcon}</div></button>
}   