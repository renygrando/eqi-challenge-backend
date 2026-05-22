type ClassDecoratorFactory = (...args: unknown[]) => ClassDecorator;
type PropertyDecoratorFactory = (...args: unknown[]) => PropertyDecorator;

const classDecorator: ClassDecoratorFactory = () => () => undefined;
const propertyDecorator: PropertyDecoratorFactory = () => () => undefined;

export const Entity = classDecorator;
export const PrimaryKey = propertyDecorator;
export const Property = propertyDecorator;

export class ReflectMetadataProvider {}
