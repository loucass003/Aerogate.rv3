import * as THREE from 'three'

export default class Position {

    constructor(pos, dir) {
        this.pos = pos;
        this.dir = dir;
    }

    static create(posX, posY, posZ, dirX, dirY, dirZ) {
        return new Position(
            new THREE.Vector3(posX, posY, posZ),
            new THREE.Vector3(dirX, dirY, dirZ)
        )
    }
}