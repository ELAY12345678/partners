import { Input, Select } from "antd";
import _ from "lodash";
import { SimpleForm } from "../../../components/com/form/";
import { MyModal } from "../../../components/com/MyModal";

const STATUS = [
    {
        id: 'active',
        name: 'Active',
        color: 'success'
    },
    {
        id: 'inactive',
        name: 'Inactive',
        color: 'error'
    },
    {
        id: 'disabled',
        name: 'Disabled',
        color: 'red'
    },
];

const PayAccountStatusForm = ({ payAccountId, visible,onCancel, onSubmit}) => {
    return (
        <MyModal
            title={"Estado appartaPay"}
            width={700}
            onCancel={() => {
                if(onCancel){
                    onCancel();
                }
            }}
            visible={visible}
        >
            <SimpleForm
                id={payAccountId}
                source="pay-accounts"
                onSubmit={(values, otherField, second)=>{
                    console.log(values, otherField, second)
                    if(onSubmit){
                        onSubmit(); 
                    }
                    if(onCancel){
                        onCancel();
                    }
                }}
                query={{ $client: { skipJoins: true } }}
                allowNull={true}
            >
                <Input
                    name="disabled_reason"
                    flex={1}
                    label="Disabled reason"
                    placeholder="Disabled reason"
                />
                <Select
                    flex={1}
                    name="status"
                    label="Estado"
                >
                    {
                        _.map(STATUS, ({ id, name }) => (
                            <Select.Option key={id} value={id}>
                                {name}
                            </Select.Option>
                        ))
                    }
                </Select>
            </SimpleForm>
        </MyModal>
    )
}

export default PayAccountStatusForm;