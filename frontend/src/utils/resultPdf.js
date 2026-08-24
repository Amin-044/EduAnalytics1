import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const NAVY = [23, 54, 105]
const INK = [33, 37, 41]
const GRAY = [110, 117, 125]
const LINE = [176, 182, 190]
const ROW_ALT = [243, 246, 250]
const GREEN = [21, 128, 61]
const RED = [200, 30, 45]

const INSTITUTE = 'EDUANALYTICS INSTITUTE OF TECHNOLOGY'
const DEPARTMENT = 'MKINSTITUTE OF COMPUTER StUDIES'
const CONTACT = 'College Road, Bharuch 392001  |  +91 2642 299337  |  adm@mkics.ac.in  |  https://mkics.ac.in/'

const formatDate = (date) =>
  date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

const academicYear = () => {
  const now = new Date()
  const start = now.getMonth() >= 5 ? now.getFullYear() : now.getFullYear() - 1
  return `${start}-${String(start + 1).slice(2)}`
}

const resultNumber = (student) =>
  `EA/${academicYear()}/${student.course}/SEM${student.semester}/${student.student_id}`

const drawLetterhead = (doc, pageW) => {
  let y = 52
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(17)
  doc.setTextColor(...NAVY)
  doc.text(INSTITUTE, pageW / 2, y, { align: 'center', charSpace: 0.4 })
  y += 17
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...INK)
  doc.text(DEPARTMENT, pageW / 2, y, { align: 'center' })
  y += 13
  doc.setFontSize(7.5)
  doc.setTextColor(...GRAY)
  doc.text(CONTACT, pageW / 2, y, { align: 'center' })
  y += 8
  doc.setDrawColor(...NAVY)
  doc.setLineWidth(1.4)
  doc.line(42, y, pageW - 42, y)
  doc.setLineWidth(0.5)
  doc.line(42, y + 2.6, pageW - 42, y + 2.6)
  return y + 24
}

const drawTitles = (doc, pageW, y) => {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...INK)
  doc.text('STATEMENT OF MARKS', pageW / 2, y, { align: 'center', charSpace: 1.2 })
  y += 14
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...GRAY)
  doc.text(`Semester End Examination — Academic Year ${academicYear()}`, pageW / 2, y, { align: 'center' })
  return y + 18
}

const drawMetaRow = (doc, pageW, y, student) => {
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAY)
  doc.text('Result No.', 42, y)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...INK)
  doc.text(resultNumber(student), 88, y)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAY)
  doc.text('Date of Issue', pageW - 42 - doc.getTextWidth(`Date of Issue  ${formatDate(new Date())}`), y)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...INK)
  doc.text(formatDate(new Date()), pageW - 42, y, { align: 'right' })
  return y + 14
}

const infoPair = (doc, x, y, label, value) => {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...GRAY)
  doc.text(label.toUpperCase(), x, y, { charSpace: 0.4 })
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...INK)
  doc.text(String(value), x, y + 12)
}

const drawStudentBlock = (doc, pageW, y, entry) => {
  const { student, rows } = entry
  const h = 85
  doc.setFillColor(246, 248, 251)
  doc.setDrawColor(...LINE)
  doc.setLineWidth(0.6)
  doc.rect(42, y, pageW - 84, h, 'FD')
  const colA = 54
  const colB = pageW / 2 + 14
  infoPair(doc, colA, y + 18, 'Student Name', student.name)
  infoPair(doc, colB, y + 18, 'Semester', student.semester)
  infoPair(doc, colA, y + 44, 'Roll Number', student.student_id)
  infoPair(doc, colB, y + 44, 'Subjects Appeared', rows.length)
  infoPair(doc, colA, y + 68 - 2, 'Course', `${student.course}`)
  infoPair(doc, colB, y + 68 - 2, 'Maximum Marks', `${rows.length * 100} (${rows.length} x 100)`)
  return y + h + 16
}

const drawMarksTable = (doc, y, entry) => {
  const body = entry.rows.map((r) => [
    r.subjectCode,
    r.subjectName,
    String(r.internal_1),
    String(r.internal_2),
    String(r.assignment),
    `${r.avg.toFixed(2)}%`,
    r.grade,
    r.passed ? 'Pass' : 'Fail',
  ])
  autoTable(doc, {
    startY: y,
    margin: { left: 42, right: 42 },
    theme: 'grid',
    head: [[
      'Code',
      'Subject',
      'Int-1\n(100)',
      'Int-2\n(100)',
      'Assign.\n(100)',
      'Average',
      'Grade',
      'Result',
    ]],
    body,
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 5,
      lineColor: LINE,
      lineWidth: 0.5,
      textColor: INK,
    },
    headStyles: {
      fillColor: NAVY,
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      fontSize: 8,
    },
    alternateRowStyles: { fillColor: ROW_ALT },
    columnStyles: {
      0: { cellWidth: 52, halign: 'center' },
      2: { cellWidth: 52, halign: 'center' },
      3: { cellWidth: 52, halign: 'center' },
      4: { cellWidth: 54, halign: 'center' },
      5: { cellWidth: 56, halign: 'center' },
      6: { cellWidth: 62, halign: 'center' },
      7: { cellWidth: 50, halign: 'center' },
    },
    didParseCell: (data) => {
      if (data.section !== 'body') return
      const raw = data.cell.raw
      const text = typeof raw === 'string' ? raw : ''
      if (text === 'Pass') data.cell.styles.textColor = GREEN
      if (text === 'Fail') data.cell.styles.textColor = RED
      if (text === 'Fail') data.cell.styles.fontStyle = 'bold'
    },
  })
  return doc.lastAutoTable.finalY
}

const statBox = (doc, x, y, w, h, label, value, opts = {}) => {
  const { accent, filled } = opts
  if (filled) {
    doc.setFillColor(...accent)
    doc.rect(x, y, w, h, 'F')
  } else {
    doc.setDrawColor(...LINE)
    doc.setLineWidth(0.6)
    doc.rect(x, y, w, h, 'S')
  }
  const fg = filled ? 255 : GRAY
  const vg = filled ? 255 : INK
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(fg === 255 ? 235 : GRAY[0], fg === 255 ? 240 : GRAY[1], fg === 255 ? 245 : GRAY[2])
  doc.text(label, x + 10, y + 15, { charSpace: 0.5 })
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(vg === 255 ? 255 : INK[0], vg === 255 ? 255 : INK[1], vg === 255 ? 255 : INK[2])
  doc.text(value, x + 10, y + 33)
}

const drawSummary = (doc, pageW, y, entry) => {
  const { overall, grade, result } = entry
  const gap = 12
  const w = (pageW - 84 - gap * 2) / 3
  const h = 46
  statBox(doc, 42, y, w, h, 'OVERALL AVERAGE', `${overall.toFixed(2)} %`)
  statBox(doc, 42 + w + gap, y, w, h, 'OVERALL GRADE', grade)
  const failed = result !== 'PASS'
  statBox(doc, 42 + (w + gap) * 2, y, w, h, 'FINAL RESULT', result, {
    filled: true,
    accent: failed ? RED : GREEN,
  })
  return y + h
}

const drawScaleNote = (doc, pageW, y) => {
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(7.5)
  doc.setTextColor(...GRAY)
  doc.text(
    'A subject is cleared at 40% average or above. Grading scale: 75%+ Excellent  |  60-74% Good  |  40-59% Needs Improvement  |  below 40% Poor.',
    pageW / 2,
    y,
    { align: 'center' },
  )
}

const drawSignatures = (doc, pageW, pageH) => {
  const y = pageH - 118
  const slots = [
    { cx: 42 + 70, label: 'Class Teacher' },
    { cx: pageW / 2, label: 'Examination Cell' },
    { cx: pageW - 42 - 70, label: 'Principal' },
  ]
  doc.setDrawColor(...INK)
  doc.setLineWidth(0.7)
  slots.forEach(({ cx, label }) => {
    doc.line(cx - 60, y, cx + 60, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...GRAY)
    doc.text(label, cx, y + 13, { align: 'center' })
  })
}

const drawFooters = (doc) => {
  const total = doc.getNumberOfPages()
  const stamp = `${formatDate(new Date())}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
  for (let i = 1; i <= total; i += 1) {
    doc.setPage(i)
    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()
    doc.setDrawColor(...LINE)
    doc.setLineWidth(0.5)
    doc.line(42, pageH - 48, pageW - 42, pageH - 48)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...GRAY)
    doc.text(`Generated by EduAnalytics ERP on ${stamp}`, 42, pageH - 34)
    doc.text(`Page ${i} of ${total}`, pageW - 42, pageH - 34, { align: 'right' })
  }
}

const drawSheet = (doc, entry, pageW, pageH) => {
  let y = drawLetterhead(doc, pageW)
  y = drawTitles(doc, pageW, y)
  y = drawMetaRow(doc, pageW, y, entry.student)
  y = drawStudentBlock(doc, pageW, y, entry)
  y = drawMarksTable(doc, y, entry)
  y = drawSummary(doc, pageW, y + 18, entry)
  drawScaleNote(doc, pageW, y + 18)
  drawSignatures(doc, pageW, pageH)
}

export const downloadResultPdf = (entries, filename) => {
  const sheets = entries.filter((e) => e.rows.length > 0 && e.overall !== null)
  if (!sheets.length) return

  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()

  sheets.forEach((entry, idx) => {
    if (idx > 0) doc.addPage()
    drawSheet(doc, entry, pageW, pageH)
  })

  drawFooters(doc)
  doc.save(filename)
}
