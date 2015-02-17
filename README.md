# Organizing Sass Transitions with Transitioner

### Transitioner creates

    .selector { ...transition rules... }
    .selector.classNameToBeAnimated { ...properties to be transitioned... }

Great for organizing multiple transitions when adding a single class via js.
Feed it classes in quotes, anything else can go either way.

##### Providing parent element(s):
You can provide namespacing elements for the transition rules selector by passing a third
argument to Transitioner, and for the selector.classNameToBeAnimated as a the argument.

##### Extending:
Write "extend #id-name" as 2nd arg to extend previous transition rules

You can even organize pseudo class transitions if it's DRY / helpful. see :hover below

## Example using Transitioner and extend with root:

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

#### Output:

    #parentelement #results, .title { 
      transition: height 0.6s ease-in-out;
    }
    #results.full-height { height: 100%; }
    .title.full-height { height: 40px; }
    #parentelement #main .fa {
      transition: all 0.3s ease-in-out;
    }
    #parentelement #main .fa:hover { color: blue; }

## Using from() and to()
### Also an Extreme (bad) Example of Namespacing with Roots

Also note that a root must be passed to from() if used in Transitioner and that
the added class can include nested selector in the same way as normal sass


    $inner-results: “#inner .results”;
    $root: “body > .block.left #main”;
    $properties-root: “.left”;

    .full-height {

      @include transitioner($inner-results, height 0.6s ease-in-out, $root, $properties-root) {
        @include from($root) {
          @extend %height0;
        }
        @include to(){
          height: 100%;
        }
      }

      &:hover{
        @include transitioner($inner-results, extend $inner-results, $root, $properties-root) {
          @include from($root) {
            @extend %height0;
          }
          @include to(){
            height: 500px;
          }
        }
      }
    }

#### Output:

    // Duplicate selectors are left on the assumption that the transition will be
    // extended and because you can’t check for preexisting selectors
    // as far as I know

    body > .block.left #main #inner .results {
      transition: height 0.6s ease-in-out;
    }

    body > .block.left #main #inner .results {
      height: 0px;
    }

    .left #inner > .results.full-height {
      height: 100%;
    }

    .left #inner > .results.full-height:hover {
      height: 500px;
    }
