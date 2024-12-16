declare const brand: unique symbol;

export type Branded<Base, Brand> = Base & { [brand]: Brand };
