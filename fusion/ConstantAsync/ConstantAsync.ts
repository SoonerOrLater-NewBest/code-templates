import * as React from 'react'
import { useRequest } from 'ahooks'

type IOption = {
    /**
     * 通常constants
     * 若为简单类型， 如 string, number
     * 自行修改，并删除where等函数
     */
    label: string;
    value: string | number;
}

function fetchConstantsRequest(): Promise<IOption[]> {
    return Promise.resolve([])
}

/**
 * 若不需要，自行删除
 *
 */
function where(params: { value: string|number }): IOption
function where(params: { values: (string|number)[] }): IOption[]
function where(params: { value: string|number } | { values: (string|number)[] }): IOption | IOption[] {
    if ('value' in params) {
        return this._values.find(o => o.value === params.value)
    } else {
        return this._values.filter(o => params.values.includes(o.value))
    }
}

export const ConstantAsync = {
    _values: [],
    _requestInstance: undefined,
    _cachedRequest() {
        if (this.value) {
            return Promise.resolve(this._values)
        }
        if (this._requestInstance) {
            return this._requestInstance
        }
        this._requestInstance = fetchConstantsRequest().then(res => {
            this._values = res
            return res
        })
        return this._requestInstance
    },
    fetchValues() {
        return this._cachedRequest()
    },
    /**
     * 若不需要，自行删除
     */
    where: (d) => where.apply(this, d),
    asReactHook() {
        return useRequest(this._cachedRequest)
    }
}
