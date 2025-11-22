type AnyObject = { [k: string]: unknown };

export const removeEmpty = <T extends AnyObject>(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== null && value !== undefined && value !== ''
    )
  );
