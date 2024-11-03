import { useThree } from "@react-three/fiber";

const cardWidth = 85.6;
const cardHeight = 53.98;
const thickness = 0.76;
const scaleFactor = 0.6;

export function useCardSize(): CardDimensions {
    const state = useThree();

    const isHorizontal = state.viewport.width > state.viewport.height;

    const largestSection = isHorizontal ? state.viewport.width : state.viewport.height;
    const cardSize = size(largestSection * scaleFactor);

    if (isHorizontal) {
        return cardSize;
    }

    return { width: cardSize.height, height: cardSize.width, thickness: cardSize.thickness };
}

type CardDimensions = {
    width: number,
    height: number,
    thickness: number,
}

function size(longestSection: number) {
    const ratio = longestSection / cardWidth;

    return {
        width: ratio * cardWidth,
        height: ratio * cardHeight,
        thickness: ratio * thickness
    };
}
