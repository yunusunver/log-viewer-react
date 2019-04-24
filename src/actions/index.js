export function readFile(text){
    return {
        type:'READ_FILE',
        payload:text
    }
} 