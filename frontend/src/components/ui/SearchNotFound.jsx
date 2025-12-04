import React, { memo } from 'react'

const SearchNotFound = memo(({searchQuery}) =>  {

    console.log('in here');
    

  return (
    <div className='flex flex-col m-10'>
      <h1 className='h1'> No results found for search `{searchQuery}`</h1>
      <h3>Please try modify your search</h3>
    </div>
  )
}
)

export default SearchNotFound
