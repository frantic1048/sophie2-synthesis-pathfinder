// MEMO: prefer `some string`
// https://rescript-lang.org/docs/manual/latest/primitive-types#string-interpolation
@genType @react.component
let make = () => {
  <div> {React.string(`すこぶる可愛い！`)} </div>
}
