import Table from 'react-bootstrap/esm/Table'
import BookLevel from './BookLevel'

export default function BookSide(props: any) {
    const cols = ['Venue','Size','Price']
    if(props.side === 'ask') {
        cols.reverse()
    }
    const data = props.data
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    {cols.map((c: string) => <th key={c}>{c}</th> )}
                </tr>
            </thead>
            <tbody>
                {data.map((level: any) => <BookLevel key={level.price} side={props.side} data={level}/>)}
            </tbody>
        </Table>
    )
}