const typeFiles: any = {
    image: ['image/*', 'image'],
    video: ['video/*', 'video'],
    audio: ['audio/*', 'audio'],
    pdf: ['application/pdf', 'pdf'],
    onlineDoc: ['application/msword', 'onlineDoc'],
    word: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'word'],
    excel1: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'excel'],
    excel2: ['application/vnd.ms-excel', 'excel'],
    powerPoint1: ['application/vnd.ms-powerpoint', 'powerpoint'],
    powerPoint2: ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'powerpoint']
}

export const TypeFiles = typeFiles.image[0] + ',' + typeFiles.video[0] + ',' + typeFiles.audio[0] + ',' + typeFiles.pdf[0] + ',' +
    typeFiles.onlineDoc[0] + ',' + typeFiles.word[0] + ',' + typeFiles.excel1[0] + ',' +
    typeFiles.excel2[0] + ',' + typeFiles.powerPoint1[0] + ',' + typeFiles.powerPoint2[0]

export function imageFile(type: string){
    let values: string[][] = Object.values(typeFiles);
    let value:string[] | undefined
    if(type.includes('image') || type.includes('video') || type.includes('audio')){
        value = values.find((v) => v[0].split('/')[0] === type.split('/')[0])
    }else{
        value = values.find((v) => v[0] === type)
    }
    return value![1]
}