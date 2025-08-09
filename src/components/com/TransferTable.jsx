import { message, Table, Transfer } from 'antd';
import _, { debounce } from 'lodash';
import difference from 'lodash/difference';
import React, { useEffect, useState } from 'react';
import { getService } from '../../services';

// Customize Table Transfer
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
    <Transfer
        {...restProps}
    >
        {({
            direction,
            filteredItems,
            onItemSelectAll,
            onItemSelect,
            selectedKeys: listSelectedKeys,
            disabled: listDisabled,
        }) => {
            const columns = direction === 'left' ? leftColumns : rightColumns;
            const rowSelection = {
                getCheckboxProps: (item) => ({
                    disabled: listDisabled || item.disabled,
                }),

                onSelectAll(selected, selectedRows) {
                    console.log(selected, selectedRows)
                    const treeSelectedKeys = selectedRows
                        .filter((item) => !item.disabled)
                        .map(({ key }) => key);
                    const diffKeys = selected
                        ? difference(treeSelectedKeys, listSelectedKeys)
                        : difference(listSelectedKeys, treeSelectedKeys);
                    onItemSelectAll(diffKeys, selected);
                },

                onSelect({ key, ...rest }, selected) {
                    // console.log({ key, ...rest }, selected)
                    onItemSelect(key, selected);
                },

                selectedRowKeys: listSelectedKeys,
            };
            return (
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    // dataSource={direction === 'left' ? filteredItems : [{ key: '0', title: 'content1', description: 'description of content1', tag: 'cat' }]}
                    dataSource={filteredItems}
                    size="small"
                    style={{
                        pointerEvents: listDisabled ? 'none' : undefined,
                    }}
                // onRow={({ key, ...rest }) => ({
                //     onClick: () => {
                //         console.log({ key, ...rest }, !listSelectedKeys.includes(key))

                //         onItemSelect(key, !listSelectedKeys.includes(key));
                //     },
                // })}
                />
            );
        }}
    </Transfer>
);

const columns = [
    {
        dataIndex: 'full_name',
        title: 'Establecimiento',
        render: (value, record) => `${value} - ${record?.city_name}`
    },
];

const TransferTable = ({ onChange, city_id, pay_benefit_id }) => {

    const establishmentBranchesService = getService('establishments-branchs');
    const payBenefitsEstablishmentsService = getService('pay-benefits-establishments-branchs');

    const [establishmentBranchesOptions, setEstablishmentBranchesOptions] = useState([]);
    const [selectedEstablishment, setSelectedEstablishment] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const [targetKeys, setTargetKeys] = useState([]);
    const [establishmentBranchesInPayBenefit, setEstablishmentBranchesInPayBenefit] = useState([]);


    const getEstablishmentBranches = (value, city_id) => {
        if (value === '') {
            setEstablishmentBranchesOptions([])
            return;
        }
        establishmentBranchesService.find({
            query: {
                q: value,
                $client: city_id ?
                    {
                        searchBranchsByCityId: city_id
                    } :
                    {
                        fullName: true
                    }
                ,
            }
        })
            .then((data) => {
                setEstablishmentBranchesOptions(
                    _.sortBy(
                        _.filter(data, ({ establishment_branch_id }) =>
                            !_.find(establishmentBranchesInPayBenefit, ({ establishment_branch_id: exits_establishment_branch_id }) => exits_establishment_branch_id === establishment_branch_id)
                        ),
                        [({ full_name }) => full_name]
                    ));
            })
            .catch((err) => message.error(err));
    };

    const handleChange = (nextTargetKeys, direction, moveKeys) => {
        setTargetKeys(nextTargetKeys);
        setSelectedEstablishment([
            ..._.filter(_.map(nextTargetKeys, (key) =>
                _.find([...selectedEstablishment, ...establishmentBranchesOptions], (item) =>
                    `${item.establishment_branch_id}` === key
                )
                // city_id: temp.city_id || temp.city_id === "null" ? temp.city_id : city_id ? city_id : "null"
            ))
        ]);
    };

    const getEstablishmentBranchesInPayBenefit = () => {
        payBenefitsEstablishmentsService.find({
            query: {
                pay_benefit_id,
                $limit: 100000
            }
        })
            .then(({ data }) => {
                setEstablishmentBranchesInPayBenefit(data);
            })
            .catch((err) => message.error(err));
    }

    const debounceGetEstablishmentBranches = debounce(getEstablishmentBranches, 500, { maxWait: 800 });

    useEffect(() => {
        onChange(selectedEstablishment);
    }, [selectedEstablishment, onChange]);

    useEffect(() => {
        debounceGetEstablishmentBranches(searchValue, city_id);
    }, [searchValue, city_id]);

    useEffect(() => {
        getEstablishmentBranchesInPayBenefit(pay_benefit_id);
    }, [pay_benefit_id]);


    return (
        <>
            <TableTransfer
                showSelectAll={false}
                showSearch
                dataSource={_.map([...establishmentBranchesOptions, ...selectedEstablishment], (record, index) => ({ ...record, key: `${record?.establishment_branch_id}` }))}
                targetKeys={targetKeys}
                onSearch={(direction, value) => direction === 'left' && setSearchValue(value)}
                onChange={handleChange}
                filterOption={(inputValue, item) =>
                    item?.full_name?.toLowerCase()?.includes(inputValue?.toLowerCase())
                }
                leftColumns={columns}
                rightColumns={columns}

            />
        </>
    );
};

export default TransferTable;