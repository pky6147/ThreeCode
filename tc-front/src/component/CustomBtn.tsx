import { Button } from '@mui/material'

interface CustomButtonProps {
    width? : string;
    height? : string;
    fontSize? : string;
    color? : string;
    fontWeight? : string;
    backgroundColor? : string;
    border? : string;
    onClick? : React.MouseEventHandler<HTMLButtonElement>,
    text? : string;
    startIcon?: React.ReactNode;
}

function CustomBtn(props: CustomButtonProps) {
    return (
        <Button 
            sx={{
                width: props.width || '80px',
                height: props.height || '35px',
                color: props.color || 'white',
                fontWeight: props.fontWeight || 'bold',
                fontSize: props.fontSize || '16px',
                backgroundColor: props.backgroundColor || 'blue',
                border: props.border || '',
                borderRadius: 3,
            }}
            onClick={props.onClick? props.onClick : ()=>{}}
            startIcon={props.startIcon}
        >
            {props.text || '버튼'}
        </Button>
    )
}

export default CustomBtn;