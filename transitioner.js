/*
    TODO build non-jquery dependent class manipulations in utils and allow passing
    in a custom animation function / library
 */

class Transitioner {
    constructor(){
        this.fake = document.createElement("fake")
        //call set end() with transition object
        this.end = {
            "transition"      : "transitionend",
            "OTransition"     : "oTransitionEnd",
            "MozTransition"   : "transitionend",
            "WebkitTransition": "webkitTransitionEnd"
        }
    }
    get end(){ return this.transitionEnd }
    set end(transitions){
        //test fake element for transition support
        for (let i in transitions){
            if (this.fake.style[i] !== undefined){
                this.transitionEnd = transitions[i]
                break
            }
        }
    }
    
    //cache selector if not already cached.
    //Available to next function calls and chains by passing false
    get el(){ return this.elements; }
    set el(selector){
        this.elements = selector instanceof jQuery && selector || $(selector)
    }
    
    //jquery classList manipulations with animation fallback and callback support
    add(element, name, t, cb = null){
        if (element)
            this.el = element //call setter and cache element
        let fn = "addClass"
        this.cbOrAnimate(this.el, fn, name, t, cb)
        return this
    }
    remove(element, name, t, cb = null){
        if (element)
            this.el = element
        let fn = "removeClass"
        this.cbOrAnimate(this.el, fn, name, t, cb)
        return this
    }
    toggle(element, name, t, cb = null){
        if (element)
            this.el = element
        let fn = "toggleClass"
        this.cbOrAnimate(this.el, fn, name, t, cb)
        return this
    }
    cbOrAnimate(el, fn, name, t, cb = null){
        if (this.end){
            el[fn](name)
            el.one(this.end, cb)
        } else {
            el.animate(t.properties, t.duration, function(){
                el[fn](name)
		if (cb)
              	    cb()
            })
        }
    }
}

//unnecessary but useful object manipulations for transitions
class Transition {
    constructor(name, subName, properties, duration = 500, easing = "swing"){
        this.name = name;
        this[subName] = { properties, duration, easing }
    }
    addTransition(subName, properties, duration = 500, easing = "swing"){
        this[subName] = { properties, duration, easing }
    }
    //TODO move to general utils object
    copyObj(original, copy = {}){
        if (original === null || typeof original !== "object")
            return original
        for (var prop in original) {
            if (original.hasOwnProperty(prop)){
                copy[prop] = (copy[prop] && typeof copy[prop] === "object") ? this.copyObj(original[prop], copy[prop])
                    : (copy[prop] === 0 || copy[prop]) ? copy[prop]
                    : original[prop]
            }
        }
        return copy
    }
    extend(newTransition, original, changes){
        this[newTransition] = this.copyObj(this[original], changes)
    }
}

export { Transition, Transitioner }


//simple example usage not including the import statement if this were placed in another file

$(() => {
    //initialize Transitioner, event string "c" and element(s)
    let [$t, c, $h1] = [new Transitioner(), "currentTarget", $("h1")]
    
    //initialize Transition with _font and add transitions
    let _font = new Transition("font", "h1", { fontSize: "200px" })
    _font.addTransition("h1Cb", {fontSize: "100px"})
    _font.extend("h1_init", "h1Cb", { duration: 100 });
    _font.extend("h1_newest", "h1Cb", { properties: { height: "999px"}})
    
    //add class on dom load, then add another as a callback for no reason
    $t.add($h1, _font.name, _font.h1_init, () => $t.remove(false, "class", _font.h1_newest))
    //using event listeners (note event.currentTarget inside of arrow function
    $h1.on("click", e => $t.add(e[c], _font.name, _font.h1, () =>
        $t.remove(false, _font.name, _font.h1Cb )))
})
