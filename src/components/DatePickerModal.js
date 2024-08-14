import React from 'react'
import DatePicker from 'react-native-date-picker'

export default function DatePickerModal({ date, setDate, open, setOpen, setSelectedDate, type }) {
    //   const [date, setDate] = useState(new Date())
    //   const [open, setOpen] = useState(false)

    return (
        <DatePicker
            modal
            mode='date'
            open={open}
            date={date}
            onConfirm={(date) => {
                setOpen(false)
                setDate(date)
                if (type === "startDate") {
                    setSelectedDate((prev) => ({
                        ...prev,
                        selectedStartDate: date
                    }))
                } else if (type === "endDate") {
                    setSelectedDate((prev) => ({
                        ...prev,
                        selectedEndDate: date
                    }))
                }
            }}
            onCancel={() => {
                setOpen(false)
            }}
        />
    )
}
