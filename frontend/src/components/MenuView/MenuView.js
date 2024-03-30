import { formatItemName } from "../../utils/formatItemName";

const MenuView = ({ menuItems }) => {
    const menuItemsByType = menuItems.reduce((acc, item) => {
        if (!acc[item.type]) {
            acc[item.type] = [];
        }
        acc[item.type].push(item);
        return acc;
    }, {});

    return (
        <>
            {Object.keys(menuItemsByType).map((type) => (
                <div key={type}>
                    <h2>{type}</h2>
                    <ul>
                        {menuItemsByType[type].map((item) => (
                            <li key={item.id}>
                                {formatItemName(item)} - ${item.price}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </>
    );
};

export { MenuView };
