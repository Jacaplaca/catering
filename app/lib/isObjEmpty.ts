const isObjEmpty = (obj: Record<string, unknown>) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export default isObjEmpty;