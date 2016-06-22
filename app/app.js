import React from 'react'
import ReactDOM from 'react-dom'

import library from './library.json'
import fuzzy from 'fuzzy'

const fuzzyOptions = { extract: (item) => item.type + ' ' + item.title }

function Product(props) {
    let product = props.product

    return (
        <li>
            { product.type } - { product.title }
            <br/>
            { product.coverImageLargeURLString ? <img height="60px" src={ product.coverImageLargeURLString }/> : '' }
        </li>
    )
}

class IndexPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = { filter: '' }
    }

    updateFilter = (event) => {
        this.setState({ filter: event.target.value })
    }

    render() {
        let filter = this.state.filter && (this.state.filter.length >= 3) && this.state.filter.toLowerCase()
        let rows = library

        if (filter)
            rows = fuzzy.filter(filter, rows, fuzzyOptions).map((item) => item.original)

        let hasMore = (rows.length > 50)

        rows = rows
            .slice(0, 50)
            .map((product) => {
                return (<Product key={ product.uuidString } product={ product } />)
            })

        return (
            <div>
                <h1>Library ({ library.length } products)</h1>
                <form>
                    <input type="text" value={ this.state.filter } placeholder="Filter products" onChange={ this.updateFilter }/>
                </form>
                <ul>
                    { rows }
                    { hasMore ? <li>...</li> : '' }
                </ul>
            </div>
        )
    }
}

ReactDOM.render((<IndexPage/>), document.getElementById('app'))
