import Sendbutton from '../sendButton/SendButton'
import styles from './Input.module.css'

export default function Input() {
    return (
        <form className={styles.container} action=''>
            <input type='text'id="inputQuestion" name="inputQuestion"/>
            <Sendbutton/>
        </form>
    )
}