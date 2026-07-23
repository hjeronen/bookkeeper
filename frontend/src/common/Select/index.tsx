interface SelectProps<T extends string | number> {
  label: string
  value: T
  onChange: (value: string) => void
  list: T[]
}

const Select = <T extends string | number>({
  label,
  value,
  onChange,
  list,
}: SelectProps<T>) => {
  return (
    <div>
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {list.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
