import {createStore} from 'vuex';
import demo_1 from './demo_1';
const store = createStore({
    // 以modules的包形式引入vuex
    modules:{
        demo_1
    }
})

export default store;