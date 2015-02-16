# Organizing Sass Transitions with Transitioner

### Transitioner creates

    .root .selector { ...transition rules... }
    .selector.classNameToBeAnimated { ...properties to be transitioned... }

great for organizing multiple transitions when adding a single class via js
feed it classes in quotes, anything else can go either way
write "extend #id-name" as 2nd arg to extend previous transition rules
provide parent element(s) (multiple selectors written as usual), or don't
can even organize pseudo class transitions if it's DRY / helpful. see :hover below

## Example:

    $root: "#parentelement";
    .full-height {
      @include transitioner(#results, height 0.6s ease-in-out, $root){
        height:100%;
      }
      @include transitioner(".title", extend #results){
        height:40px;
      }
    }
    :hover{
      @include transitioner("#main .fa", all 0.3s ease-in-out, $root, $root){
        color: blue;
      }
    }

### Output:

    #parentelement #results, .title { 
      transition: height 0.6s ease-in-out;
    }
    #results.full-height { height: 100%; }
    .title.full-height { height: 40px; }
    #parentelement #main .fa {
      transition: all 0.3s ease-in-out;
    }
    #parentelement #main .fa:hover { color: blue; }

## Extreme (bad) Example of Namespacing with Roots

dot or hash delimited selectors can be the main element,
but space descendants must be in $root or $properties-root variables

    $root: "body > .block.left #main";
    $properties-root: "left";

    .full-height {
      @include transitioner("#inner.results", height 0.6s ease-in-out, $root, $properties-root){
        @include from($root){
          height:0px;
        }
        @include to(){
          height:100%;
        }
      }
    }

### Output:

    body > .block.left #main #inner.results {
      transition: height 0.6s ease-in-out;
    }

    body > .block.left #main #inner.results {
      height: 0px;
    }

    .left #inner.results.full-height {
      height: 100%;
    }
