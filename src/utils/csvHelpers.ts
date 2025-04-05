interface Employee {
  id?: number
  code: string
  firstName: string
  lastName: string
  occupation: string
  department: string
  employmentDate: string
  terminationDate: string | null
}

export const exportToCSV = (employees: Employee[], fileName: string) => {
  const headers = [
    'Code',
    'First Name',
    'Last Name',
    'Occupation',
    'Department',
    'Employment Date',
    'Termination Date',
  ]
  const data = employees.map((employee) => [
    employee.code,
    employee.firstName,
    employee.lastName,
    employee.occupation,
    employee.department,
    employee.employmentDate,
    employee.terminationDate || '',
  ])

  const csvContent = [headers.join(','), ...data.map((row) => row.join(','))].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${fileName}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const parseCSV = async (file: File): Promise<Employee[]> => {
  const text = await file.text()
  const lines = text.split('\n').filter((line) => line.trim())

  if (lines.length < 2) {
    throw new Error('File is empty or missing data rows')
  }

  const headers = lines[0].toLowerCase().split(',')
  const expectedHeaders = [
    'code',
    'first name',
    'last name',
    'occupation',
    'department',
    'employment date',
    'termination date',
  ]

  if (!expectedHeaders.every((header) => headers.includes(header))) {
    throw new Error(
      'Invalid CSV headers. Expected: Code, First Name, Last Name, Occupation, Department, Employment Date, Termination Date',
    )
  }

  const employees: Employee[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((value) => value.trim())

    if (values.length !== headers.length) {
      throw new Error(`Row ${i + 1}: Invalid number of columns`)
    }

    const employee = {
      code: values[headers.indexOf('code')],
      firstName: values[headers.indexOf('first name')],
      lastName: values[headers.indexOf('last name')],
      occupation: values[headers.indexOf('occupation')],
      department: values[headers.indexOf('department')],
      employmentDate: values[headers.indexOf('employment date')],
      terminationDate: values[headers.indexOf('termination date')] || null,
    }

    employees.push(employee)
  }

  return employees
}

export const validateCSVFormat = (employees: Employee[]): string[] => {
  const errors: string[] = []

  employees.forEach((employee, index) => {
    const rowNumber = index + 2 // Account for header row and 0-based index

    if (!employee.code?.match(/^EMP\d{3}$/)) {
      errors.push(`Row ${rowNumber}: Invalid employee code format`)
    }
    if (!employee.firstName?.trim()) {
      errors.push(`Row ${rowNumber}: Missing first name`)
    }
    if (!employee.lastName?.trim()) {
      errors.push(`Row ${rowNumber}: Missing last name`)
    }
    if (!employee.occupation?.trim()) {
      errors.push(`Row ${rowNumber}: Missing occupation`)
    }
    if (!employee.department?.trim()) {
      errors.push(`Row ${rowNumber}: Missing department`)
    }
    if (!employee.employmentDate?.trim()) {
      errors.push(`Row ${rowNumber}: Missing employment date`)
    }
  })

  return errors
}
