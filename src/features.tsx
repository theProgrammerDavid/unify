import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './index.css'

function card(heading: string, body: string, tooltip: any = undefined) {
    return (
        <div className="">
            <div className="uk-light uk-background-secondary uk-padding">
                <h3>{heading}
                    {tooltip !== undefined ? tooltip : <></>}
                </h3>
                <p>{body}</p>

            </div>
        </div>
    )
}

function Features() {
    return (
        <div className="popup">
            <div className="uk-child-width-expand@s uk-text-center" uk-grid="true" >
                <div className="">
                    {card('Fast af', 'Native Asynchronous Javascript PDF Manipulation', <>&nbsp;<span uk-icon="icon: info" uk-tooltip="Speed depends on CPU and disk"></span></>)}
                </div>
                <div>
                    {card('Privacy 💯', 'All conversion done in web browser. No external servers and no ads')}
                </div>
                <div className="disabled  ">
                    {card('Versatile', 'Coming soon - Doc and PPT Manipulation')}
                </div>
            </div>

            {/* ----------------------- */}


            <div className="uk-child-width-expand@s uk-text-center" uk-grid="true" >
                <div>
                    {card('No Limit', 'No upper limit for maximum docs merged. CPU go brrrr')}
                </div>
                <div>
                    {card('Convert Offline', 'Install as a PWA to convert documents offline', <>&nbsp;<span uk-icon="icon: info" uk-tooltip="You need to manually install it / add to homepage"></span></>)}
                </div>
                <div className="">
                    {card('Zip Download', 'Save pdf as compressed zip to disk')}
                </div>
            </div>
        </div>
    )
}

const pop = () => (<Popup modal trigger={<div className="uk-background-secondary uk-padding-small features white"> Features</div>} position="bottom center">    <div><Features /></div>  </Popup>);

export default pop;