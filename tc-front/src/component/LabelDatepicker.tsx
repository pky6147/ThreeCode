import {Box, Typography} from '@mui/material'
import dayjs, {Dayjs } from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

interface LabelDatepickerProps {
    labelText?: string;
    value?: number | string;
    color?: string;
    fontSize?: number;
    onChange?: (value: Dayjs | null) => void;
}

export default function LabelDatepicker({labelText, value, color, fontSize, onChange}: LabelDatepickerProps) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '320px'}}>
            <Typography sx={{
                color: color || 'white', fontSize: fontSize || 18, fontWeight: 'bold', minWidth: '70px'
            }}
            >
                {labelText}
            </Typography>
            <DatePicker
              format="YYYY-MM-DD"
              value={value ? dayjs(value) : null}
              onChange={onChange}
              slotProps={{
                textField: {
                  size: 'small',
                  // sx: { width: '100%', backgroundColor: 'white', border: '1px solid', borderRadius: 1 },
                  sx: { width: '246px', minWidth: '246px', backgroundColor: 'white', border: '1px solid', borderRadius: 1 },
                },
              }}
            />
        </Box>
    )
}