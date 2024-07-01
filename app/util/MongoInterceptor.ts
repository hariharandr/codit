import { toSnakeCase } from '@/app/util/utils';

const MongoInterceptor = {
    get(target: any, prop: string) {
        if (!target.data) {
            throw new Error(`No data initialized for ${target.constructor.name}`);
        }
        if (prop in target.data) {
            return target.data[prop];
        }

        const methods = ['get', 'set', 'has', 'unset', 'push', 'pull', 'in'];
        const method = methods.find(m => prop.startsWith(m));

        if (method) {
            const property = toSnakeCase(prop.slice(method.length));
            switch (method) {
                case 'get':
                    return target.data[property];
                case 'set':
                    return async (value: any) => {
                        target.data[property] = value;
                        await target.save();
                    };
                case 'has':
                    return () => !!target.data[property];
                case 'unset':
                    return async () => {
                        delete target.data[property];
                        await target.save();
                    };
                case 'push':
                    return async (value: any) => {
                        if (!Array.isArray(target.data[property])) {
                            target.data[property] = [];
                        }
                        target.data[property].push(value);
                        await target.save();
                    };
                case 'pull':
                    return async (value: any) => {
                        if (Array.isArray(target.data[property])) {
                            target.data[property] = target.data[property].filter(
                                (item: any) => item !== value
                            );
                            await target.save();
                        }
                    };
                case 'in':
                    return (value: any) => {
                        if (!Array.isArray(value)) {
                            value = [value];
                        }
                        return target.data[property] && target.data[property].some((item: any) => value.includes(item));
                    };
                default:
                    throw new Error(`Method ${prop} does not exist on ${target.constructor.name}.`);
            }
        } else {
            throw new Error(`Method ${prop} does not exist on ${target.constructor.name}.`);
        }
    },
    set(target: any, prop: string, value: any) {
        target.data[prop] = value;
        target.save();
        return true;
    },
};

export default MongoInterceptor;
