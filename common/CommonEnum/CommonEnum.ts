type IOption = { label: string; value: string | number }

interface IItems {
    [p: string]: { label: string; value: string; };
}

const items = <%-items%>;

function where(params: { value: string|number }): IOption
function where(params: { values: (string|number)[] }): IOption[]
function where(params: { value: string|number } | { values: (string|number)[] }): IOption | IOption[] {
    if ('value' in params) {
        return this._values.find(o => o.value === params.value)
    } else {
        return this._values.filter(o => params.values.includes(o.value))
    }
}

export const CommonEnum = {
    ...items,
    _values: items,
    asArray: () => Object.keys(items).map(key => items[key]),
    where: (args) => where.apply(this, args),
}
