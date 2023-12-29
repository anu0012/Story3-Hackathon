const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

/*** data ***/

//          twist0        //
//         /   |   \      //
//  twist1 twist2 twist3  //
//                   |    //
//                twist31 //

// title should be from 1 to 80 chars
// body should be from 40 to 1200 chars

const twist0 = {
    "title": "The Enchanted Locket",
    "body": `In the quaint village of Eldoria, young Amelia stumbled upon an ancient locket in her grandmother's attic. Whispers of its magical powers intrigued her, and she decided to wear it, inadvertently embarking on a journey that would defy her expectations.

    As the enchanted locket dangled from her neck, Amelia found herself in a hidden forest, faced with three diverging paths. A choice awaited her:
    
    She chose the left path, unveiling a grove of whispering trees that imparted cryptic advice. A distant cry for help disrupted the tranquility, urging her to decide:
    
    Amelia followed the cry, discovering a mischievous sprite ensnared in a magical trap. A tempting deal presented itself:
    
    If she agreed, the sprite revealed its true nature as a shape-shifting trickster, weaving illusions and puzzles that tested her wit. If she refused, it transformed into a loyal companion, adding unexpected depth to her journey.
    `
};

const twist1 = {
    "title": "The Deceptive Sprite",
    "body": "However, the seemingly loyal companion had a hidden agenda, secretly working to manipulate Amelia's choices for its own mischievous purposes."
};

const twist2 = {
    "title": "The Secret Ally",
    "body": `Contrary to expectations, the loyal companion proved to be a powerful ally, surprising Amelia with invaluable assistance at critical junctures.

    Continuing her odyssey, an ancient elemental guardian appeared, offering a trial:
    
    Choosing courage, wisdom, or compassion, the guardian disclosed a hidden aspect of the locket's origin, hinting at a power that required sacrifice.
    `
};

const twist3 = {
    "title": "The Guardian's Revelation",
    "body": `The guardian, sensing Amelia's uncertainty, revealed a deeper secret about the locket—a dormant power that could only be unlocked by facing a personal sacrifice.

    Completing the trial, the locket glowed, exposing a forgotten prophecy linking her destiny to Eldoria. A pivotal choice emerged:
    
    Rejecting the prophecy summoned a rogue seer, warning of dire consequences if she denied her fate, introducing a struggle against destiny.
    
    At a crossroads, three paths beckoned:
    
    Regardless of her choice, betrayal lurked, reshaping alliances and objectives in an unexpected turn.`
};

const twist31 = {
    "title": "The Betrayal's Origin",
    "body": `Amelia discovered that the betrayal stemmed from an unexpected source—the very locket she wore, which had a mind of its own and sought to fulfill its own mysterious agenda.

    The final confrontation loomed with a power-hungry sorceress:
    
    Confrontation, negotiation, or sacrifice—each choice unfolded a unique resolution. Sacrificing the locket unveiled a greater power, leading to an unexpected alliance.

    The sorceress, touched by Amelia's sacrifice, underwent a change of heart, abandoning her dark ambitions and joining forces to protect the newfound power.

    The threads of fate woven by Amelia's choices culminated in an epilogue:

    Consequences rippled through Eldoria, characters, and the locket's true purpose, leaving the door open for unforeseen twists and new beginnings in the future.`
};
/*** /data ***/

async function main() {
    // Get api token on https://story3.com/profile
    // please DO NOT COMMIT your token, keep it safe
    // if token was leaked you can refresh it using API endpoint `/api/v2/users/me/api_key`
    const token = process.env.TOKEN;
    console.log(token);

    // We should create story first. In order to do that we do POST request with root twist data.
    const twist0res = await axios.post(
        'https://story3.com/api/v2/stories',
        twist0,
        {
            headers: {
                'x-auth-token': token
            }
        }
    );
    const rootHashId = twist0res.data.hashId;

    // We are ready to add twists. We do POST request with twist data and specify hashId of the parent.
    const twist1res = await axios.post(
        'https://story3.com/api/v2/twists',
        {
            ...twist1, // copy data from `twist1`
            "hashParentId": rootHashId
        },
        {
            headers: {
                'x-auth-token': token
            }
        }
    );

    // When we created story with at least one twist. We can publish it.
    const twist2res = await axios.post(
        'https://story3.com/api/v2/twists',
        {
            ...twist2,
            "hashParentId": rootHashId
        },
        {
            headers: {
                'x-auth-token': token
            }
        }
    );

    const twist3res = await axios.post(
        'https://story3.com/api/v2/twists',
        {
            ...twist3,
            "hashParentId": rootHashId
        },
        {
            headers: {
                'x-auth-token': token
            }
        }
    );

    const twist31res = await axios.post(
        'https://story3.com/api/v2/twists',
        {
            ...twist31,
            "hashParentId": twist3res.data.hashId
        },
        {
            headers: {
                'x-auth-token': token
            }
        }
    );

    // publish each twist at the 1st level
    for(const res of [twist0res, twist1res, twist2res, twist3res, twist31res]) {
        await axios.post(
            `https://story3.com/api/v2/twists/${res.data.hashId}/publish`,
            null,
            {
                headers: {
                    'x-auth-token': token
                }
            }
        );
    }
}

main()
    .catch(e => console.error(e))