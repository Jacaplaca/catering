const toBool = (value?: string): boolean => value != null && !~['', 'false', 'n', 'no', 'off', '0'].indexOf(value.toString().toLowerCase());

export default toBool;