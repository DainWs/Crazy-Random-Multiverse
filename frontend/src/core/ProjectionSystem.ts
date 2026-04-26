class ProjectionSystem {
    private static readonly FOCAL_LENGTH = 1800;
    private static readonly DEPTH_OFFSET = 7000;

    public static project(localX: number, localY: number): { x: number; y: number; scale: number } {
        const depth = this.DEPTH_OFFSET - localY;
        const scale = this.FOCAL_LENGTH / depth;

        return {
            x: localX * scale,
            y: localY * scale,
            scale
        };
    }

    public static projectQuad(
        left: number, right: number, top: number, bottom: number
    ): { tl: {x: number, y: number}; tr: {x: number, y: number}; bl: {x: number, y: number}; br: {x: number, y: number} } {
        const pTL = this.project(left, top);
        const pTR = this.project(right, top);
        const pBL = this.project(left, bottom);
        const pBR = this.project(right, bottom);
        return {
            tl: { x: pTL.x, y: pTL.y },
            tr: { x: pTR.x, y: pTR.y },
            bl: { x: pBL.x, y: pBL.y },
            br: { x: pBR.x, y: pBR.y }
        };
    }
}

export default ProjectionSystem;
