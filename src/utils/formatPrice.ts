export const formatPrice = (amount: number) => {
    if (amount === null || amount === undefined )
    return null;

    const formattedAmount = new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "VND"
    }).format(amount);

    const currencySymbol = formattedAmount.charAt(-1);

    const amountWithoutSymbol = formattedAmount.slice(0);

    return `${amountWithoutSymbol} ${currencySymbol}`;
}
