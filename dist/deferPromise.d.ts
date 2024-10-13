export default function deferPromise<T>(): {
    then: (f: ((value: T) => unknown)) => Promise<unknown>;
    callback: (err: any, ...data: any) => void;
    promise: Promise<T>;
};
