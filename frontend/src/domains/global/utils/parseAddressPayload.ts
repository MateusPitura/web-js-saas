interface ParseAddressPayloadProperties<T> {
  newAddress?: T;
  oldAddress?: Record<string, string> | null;
}

export default function parseAddressPayload<T>({
  newAddress,
  oldAddress,
}: ParseAddressPayloadProperties<T>):
  | Record<string, NonNullable<T> | boolean>
  | undefined {
  if (newAddress && !oldAddress) {
    return {
      add: newAddress,
    };
  } else if (newAddress && oldAddress) {
    return {
      update: newAddress,
    };
  } else if (!newAddress && oldAddress) {
    return {
      remove: true,
    };
  }
}
