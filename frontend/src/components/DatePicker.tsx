
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';




type Props = {
    label : string,
    value : string | null,
    size : 'small' | 'medium',
    fullWidth? : boolean | true,
    onChange : (e?:any) => void

}

const CustomDatePicker = ({label = 'Date', value, size, fullWidth, onChange }:Props) => {


    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
                sx={{pt:1, width: '100%'}}
                label={label}
                value={dayjs(value) || null}
                onChange={onChange}
                slotProps={{
                    textField : {size, fullWidth}
                }}
            />
        </LocalizationProvider>
    )
}


export default CustomDatePicker;