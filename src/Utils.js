import Position from './Position.js'
import * as THREE from 'three'

export function parsePos(str) {
    const arr = str.trim().split('@');
    const posArr = arr[0].split(';');
    const dirArr = (arr[1] || '').split(';');
    return Position.create(
        posArr[0].trim(), posArr[1].trim(), posArr[2].trim(),
        THREE.Math.degToRad(dirArr[0]), THREE.Math.degToRad(dirArr[1]), THREE.Math.degToRad(dirArr[2])
    );
}

export function parseCamera(str) {
    if(!str)
        return null;
    const arr = str.trim().split('@');
    const posArr = arr[0].split(';');
    const dirArr = (arr[1] || '').split(';');
    return Position.create(
        parseInt(posArr[0].trim()), parseInt(posArr[1].trim()), parseInt(posArr[2].trim()),
        parseInt(dirArr[0].trim()), parseInt(dirArr[1].trim()), parseInt(dirArr[2].trim())
    );
}

export function parseCameras(str) {
    if(!str)
        return null;
    const arr = str.split('|');
    return arr.map((a) => parseCamera(a));
}

export function parseScale(str) {
    if(!str)
        return null;
    const scaleArr = str.split(';');
    return new THREE.Vector3(scaleArr[0].trim(), scaleArr[1].trim(), scaleArr[2].trim())
}
