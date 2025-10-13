import { Box, Breadcrumbs, Typography, Card } from '@mui/material'

function Routing() {
    return (
        <Card
            sx={{ height: '98%', margin: '0.5%'}}
        >
            <Box>
                {/* Breadcrumbs 영역 */}
                <Breadcrumbs sx={{padding: '5px'}}>
                    <Typography sx={{ color: 'text.primary' }}>기준정보 관리</Typography>
                    <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>라우팅 관리</Typography>
                </Breadcrumbs>
                {/* Content 영역 */}
                <Box>

                </Box>
            </Box>
        </Card>
    )
}

export default Routing;