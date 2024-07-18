
function NoiseLevelButton({noiseNumber}: {noiseNumber : number}) {
    return( 
        <button>
            {noiseNumber}
        </button>
    );
}

export function NoiseLevelReporter() {
    return (
        <div>
            <div> <p>Report Noise Level of Floor</p> </div>
            <div>
                <NoiseLevelButton noiseNumber={1}/>
                <NoiseLevelButton noiseNumber={2}/>
                <NoiseLevelButton noiseNumber={3}/>
                <NoiseLevelButton noiseNumber={4}/>
                <NoiseLevelButton noiseNumber={5}/>
            </div>
        </div>
    )
}