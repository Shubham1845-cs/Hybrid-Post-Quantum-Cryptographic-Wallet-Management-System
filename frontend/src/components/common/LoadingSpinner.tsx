interface LoadingSpinnerProps{
    message?:string;
}

const LoadingSpinner=({message='Loading...'}:LoadingSpinnerProps)=>
{
        return(
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-5">
                <div className="relative w-16 h-16">
                    <div className="absolute insert-0 rounded-full border-4 border-transparent border-t-violet-500 animate-spinRing "/>
                    <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-indigo-400 animate:spinRing [animation-direction:reverse] [animation-duration:0.7s"/>
                     <div className="absolute inset-4 rounded-full border-e-violet-500/20 shadow-[0_0_12px_4px_rgba(139,92,246,0,4)]"/>
                  
                </div>
                <p className="text-sm font-mono text-violet-300 tracking-widest uppercase">{message}</p>
            </div>   
        )
}
export default LoadingSpinner;