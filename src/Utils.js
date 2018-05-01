import Position from './Position.js'
import * as THREE from 'three'

export function parsePos(str) {
    const arr = str.split('@');
    const posArr = arr[0].split(';');
    const dirArr = arr[1].split(';');
    return Position.create(
        posArr[0], posArr[1], posArr[2],
        THREE.Math.degToRad(dirArr[0]), THREE.Math.degToRad(dirArr[1]), THREE.Math.degToRad(dirArr[2])
    );
}

export function parseCamera(str) {
    if(!str)
        return null;
    const arr = str.split('@');
    const posArr = arr[0].split(';');
    const dirArr = arr[1].split(';');
    return Position.create(
        posArr[0], posArr[1], posArr[2],
        dirArr[0], dirArr[1], dirArr[2]
    );
}

export function parseCameras(str) {
    if(!str)
        return null;
    const arr = str.split('|');
    return arr.map((a) => parseCamera(a));
}