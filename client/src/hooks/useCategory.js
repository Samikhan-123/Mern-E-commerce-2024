import axios from 'axios'
import { useEffect, useState } from 'react'

const useCategory = () => {
    const [categories, setCategories] = useState([])
    const getCatagories = async () => {
        try {
            const { data } = await axios.get('/api/v1/category/get-category')
            if (data && data.category) {
                console.log(data.category)
                setCategories(data?.category)
            } else {
                console.log('data  not fount')
                
            }
        
        } catch (error) {
            console.error(error)
        }

    }
    useEffect(() => {
        getCatagories()
    }, [])
    return categories
}
export default useCategory