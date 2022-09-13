export namespace gameData {
    export interface farmData {
        lv: string,
        gold: string,
        curCropper: number,
        curtime: number,
        isOpen: boolean,
    }

    export enum fishState {
        move = 1,
        click = 2,
    }

    export const fishScale = 0.7;
    export const fishSKeWidth = 450 * fishScale;
    export const fishSKeHeight = 450 * fishScale;
}
