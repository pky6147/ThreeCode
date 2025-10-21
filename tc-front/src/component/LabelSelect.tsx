import {
    Box, 
    Typography,
    FormControl,
    MenuItem,
    Select
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'

interface LabelSelectProps {
    // Label
    labelText?: string;
    color?: string;
    fontSize?: number;
    // SelectBox
    value?: string;
    onChange?: (event: SelectChangeEvent<string>) => void;
    options: { id: string; name: string}[];
    disabled?: boolean;
    required?: boolean;
}

export default function LabelSelect({labelText, color, value, fontSize, onChange, options, disabled, required}: LabelSelectProps) {

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '320px'}}>
            <Box sx={{ display: 'flex', minWidth: '70px'}}>
                <Typography sx={{ color: color || 'white', fontSize: fontSize || 18, fontWeight: 'bold' }}>
                    {labelText}                
                </Typography>
                {required && (
                    <Typography sx={{
                        color: 'red', fontSize: 18, fontWeight: 'bold', marginLeft: 0.5
                    }}>
                        *
                    </Typography>
                )}
            </Box>
            <FormControl sx={{width: '246px', height: '40px', minWidth: '246px'}}>
                <Select
                    onChange={onChange}
                    value={value || ''}
                    sx={{ height: '100%', backgroundColor: 'white', border: '1px solid'}}
                    disabled={disabled || false}
                >
                    {options.map(opt => (
                        <MenuItem key={opt.id} value={opt.id}>
                            {opt.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
}