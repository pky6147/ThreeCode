import { Button } from '@mui/material'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

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
    endIcon?: React.ReactNode;
    icon?: 'add' | 'edit' | 'delete' | 'search' | 'reset' | 'check' | 'close' | ''
}

function CustomBtn(props: CustomButtonProps) {
    switch (props.icon) {
        case 'add':
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
                    endIcon={<AddIcon />}
                >
                    {props.text || '버튼'}
                </Button>
            )
        case 'edit':
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
                >
                    <ModeEditIcon />
                </Button>
            )
        case 'delete':
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
                >
                    <DeleteIcon />
                </Button>
            )
        case 'search':
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
                    endIcon={<SearchIcon />}
                >
                    {props.text || '버튼'}
                </Button>
            )
        case 'reset':
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
                    endIcon={<RestartAltIcon />}
                >
                    {props.text || '버튼'}
                </Button>
            )
        case 'check':
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
                    
                >
                    <CheckIcon />
                </Button>
            )
        case 'close':
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
                    
                >
                    <CloseIcon />
                </Button>
            )
        default:
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
                    endIcon={props.endIcon}
                >
                    {props.text || '버튼'}
                </Button>
            )
    }
}

export default CustomBtn;