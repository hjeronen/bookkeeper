import React from 'react'
import './Table.css'

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean
}
type TableSectionProps = React.HTMLAttributes<HTMLTableSectionElement>
type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>
interface TableCellProps
  extends
    React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
    React.TdHTMLAttributes<HTMLTableDataCellElement> {}

const getClassNames = (base: string, classNames: string[]) => {
  return [base, ...classNames].filter(Boolean).join(' ')
}

export const Table = ({
  children,
  className = 'app-table',
  striped = false,
  ...props
}: TableProps) => {
  return (
    <table
      className={getClassNames(className, [
        striped ? 'app-table--striped' : '',
      ])}
      {...props}
    >
      {children}
    </table>
  )
}

Table.Head = ({ children, className = '', ...props }: TableSectionProps) => {
  return (
    <thead className={getClassNames('app-table__head', [className])} {...props}>
      {children}
    </thead>
  )
}

Table.Body = ({ children, className = '', ...props }: TableSectionProps) => {
  const rowCount = React.Children.count(children)
  return (
    <tbody
      className={getClassNames('app-table__body', [
        className,
        rowCount > 2 ? 'app-table__body--should-stripe' : '',
      ])}
      {...props}
    >
      {children}
    </tbody>
  )
}

Table.Row = ({ children, className = '', ...props }: TableRowProps) => {
  return (
    <tr className={getClassNames('app-table__row', [className])} {...props}>
      {children}
    </tr>
  )
}

Table.HeaderCell = ({ children, className = '', ...props }: TableCellProps) => {
  return (
    <th
      className={getClassNames('app-table__header-cell', [className])}
      {...props}
    >
      {children}
    </th>
  )
}

Table.DataCell = ({ children, className = '', ...props }: TableCellProps) => {
  return (
    <td
      className={getClassNames('app-table__data-cell', [className])}
      {...props}
    >
      {children}
    </td>
  )
}
