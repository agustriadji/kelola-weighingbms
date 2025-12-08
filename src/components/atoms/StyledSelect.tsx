import * as Select from '@radix-ui/react-select';

export function StyledSelect({ value, onChange, placeholder, items }: any) {
  return (
    <Select.Root value={value || ''} onValueChange={onChange}>
      <Select.Trigger
        className="
          h-10 border rounded-md px-3 w-full text-left 
          flex items-center justify-between
          focus:ring-2 focus:ring-blue-500 outline-none
        "
      >
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="bg-white border rounded-md shadow-lg z-50"
          position="popper"
          sideOffset={4}
        >
          <Select.Viewport className="p-1">
            {items.map((item) => (
              <Select.Item
                key={item.value}
                value={item.value}
                className="px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <Select.ItemText>{item.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
