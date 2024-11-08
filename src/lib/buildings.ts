export interface Building {
    width: number;
    length: number;
    color: number[];
}

export interface Buildings {
    [key: string]: Building;
}

export const buildings = {
    assembler: {
        width: 10, length: 15, color: [129, 200, 190, 100]
    },
    constructor: {
        width: 8, length: 10, color: [153, 209, 219, 100]
    },
    smelter: {
        width: 6, length: 9, color: [133, 193, 220, 100]
    },
    converter: {width: 16, length: 16, color: [239, 159, 118, 100]},
    foundry: {width: 10, length: 9, color: [229, 200, 140, 100]},
    refinery: {width: 10, length: 20, color: [202, 158, 230, 100]},
    packager: {width: 8, length: 8, color: [228, 184, 244, 100]},
    particle_accelerator: {width: 24, length: 38, color: [166, 234, 158, 100]},
    manufacturer: {width: 18, length: 20, color: [200, 25, 212, 100]},
    coal_generator: {width: 10, length: 26, color: [30, 102, 245, 100]},
    biomass_generator: {width: 8, length: 8, color: [254, 100, 11, 100]},
    biomass_generator_integrated: {width: 4, length: 8, color: [254, 100, 11, 100]},
    fuel_generator: {width: 20, length: 20, color: [234, 118, 203, 100]},
    nuclear_generator: {width: 36, length: 43, color: [23, 146, 43, 100]},
}