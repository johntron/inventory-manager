export default function removeChildren($el) {
    while ($el.firstChild) {
        $el.removeChild($el.firstChild);
    }
}